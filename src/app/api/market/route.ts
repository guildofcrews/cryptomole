import { NextRequest, NextResponse } from "next/server";
import {
  fetchCoinGecko,
  parseCoinIds,
  PRICE_RESPONSE_HEADERS,
} from "@/lib/coingecko";

export const dynamic = "force-dynamic";

interface CoinMarketData {
  id: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  market_cap_rank: number | null;
  sparkline_in_7d?: { price: number[] };
}

export async function GET(request: NextRequest) {
  const ids = parseCoinIds(request.nextUrl.searchParams.get("ids"));
  if ("error" in ids) {
    return NextResponse.json(
      { error: ids.error },
      { status: ids.status, headers: PRICE_RESPONSE_HEADERS }
    );
  }
  if (ids.ids.length === 0) {
    return NextResponse.json({ coins: [] }, { headers: PRICE_RESPONSE_HEADERS });
  }

  try {
    const { value: data } = await fetchCoinGecko<CoinMarketData[]>(
      `/coins/markets?vs_currency=usd&ids=${ids.ids.join(",")}&sparkline=true&price_change_percentage=24h`
    );

    const coins = data.map((coin) => ({
      id: coin.id,
      symbol: coin.symbol,
      price: coin.current_price,
      priceChange24h: coin.price_change_percentage_24h ?? 0,
      marketCap: coin.market_cap,
      rank: coin.market_cap_rank,
      sparkline: coin.sparkline_in_7d?.price ?? [],
    }));

    return NextResponse.json({ coins }, { headers: PRICE_RESPONSE_HEADERS });
  } catch (error) {
    console.error("Failed to fetch market data:", error);
    return NextResponse.json(
      { error: "Failed to fetch market data" },
      { status: 502, headers: PRICE_RESPONSE_HEADERS }
    );
  }
}
