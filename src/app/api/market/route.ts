import { NextRequest, NextResponse } from "next/server";

const COINGECKO_API_BASE = "https://api.coingecko.com/api/v3";

export interface CoinMarketData {
  id: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  market_cap_rank: number | null;
  sparkline_in_7d?: { price: number[] };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids");

  if (!ids) {
    return NextResponse.json({ error: "ids parameter required" }, { status: 400 });
  }

  const idList = ids.split(",").filter(Boolean);
  if (idList.length === 0) {
    return NextResponse.json({ coins: [] });
  }

  if (idList.length > 100) {
    return NextResponse.json(
      { error: "Maximum 100 coins per request" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${COINGECKO_API_BASE}/coins/markets?vs_currency=usd&ids=${ids}&sparkline=true&price_change_percentage=24h`,
      {
        next: { revalidate: 300 },
        headers: { Accept: "application/json" },
      }
    );

    if (!response.ok) {
      console.error(`CoinGecko API error: ${response.status}`);
      return NextResponse.json(
        { error: "Failed to fetch market data" },
        { status: 502 }
      );
    }

    const data: CoinMarketData[] = await response.json();

    const coins = data.map((coin) => ({
      id: coin.id,
      symbol: coin.symbol,
      price: coin.current_price,
      priceChange24h: coin.price_change_percentage_24h ?? 0,
      marketCap: coin.market_cap,
      rank: coin.market_cap_rank,
      sparkline: coin.sparkline_in_7d?.price ?? [],
    }));

    return NextResponse.json({ coins });
  } catch (error) {
    console.error("Failed to fetch market data:", error);
    return NextResponse.json(
      { error: "Failed to fetch market data" },
      { status: 500 }
    );
  }
}
