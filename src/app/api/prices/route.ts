import { NextRequest, NextResponse } from "next/server";

const COINGECKO_API_BASE = "https://api.coingecko.com/api/v3";

interface PriceQuote {
  id: string;
  price: number;
  change7d: number;
  ts: number;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids");

  if (!ids) {
    return NextResponse.json(
      { error: "ids parameter required" },
      { status: 400 }
    );
  }

  const idList = ids.split(",").filter(Boolean);
  if (idList.length === 0) {
    return NextResponse.json([]);
  }

  if (idList.length > 100) {
    return NextResponse.json(
      { error: "Maximum 100 coins per request" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${COINGECKO_API_BASE}/coins/markets?vs_currency=usd&ids=${ids}&sparkline=false&price_change_percentage=7d`,
      {
        next: { revalidate: 30 },
        headers: { Accept: "application/json" },
      }
    );

    if (!response.ok) {
      console.error(`CoinGecko API error: ${response.status}`);
      return NextResponse.json(
        { error: "Failed to fetch prices" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const ts = Date.now();

    const quotes: PriceQuote[] = data.map(
      (coin: {
        id: string;
        current_price: number;
        price_change_percentage_7d_in_currency?: number;
      }) => ({
        id: coin.id,
        price: coin.current_price,
        change7d: coin.price_change_percentage_7d_in_currency ?? 0,
        ts,
      })
    );

    return NextResponse.json(quotes, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Failed to fetch prices:", error);
    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 500 }
    );
  }
}
