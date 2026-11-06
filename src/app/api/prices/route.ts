import { NextRequest, NextResponse } from "next/server";
import {
  fetchCoinGecko,
  parseCoinIds,
  PRICE_RESPONSE_HEADERS,
} from "@/lib/coingecko";

interface PriceQuote {
  id: string;
  price: number;
  change7d: number;
  ts: number;
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const ids = parseCoinIds(request.nextUrl.searchParams.get("ids"));
  if ("error" in ids) {
    return NextResponse.json(
      { error: ids.error },
      { status: ids.status, headers: PRICE_RESPONSE_HEADERS }
    );
  }
  if (ids.ids.length === 0) {
    return NextResponse.json([], { headers: PRICE_RESPONSE_HEADERS });
  }

  try {
    const { value: data, fetchedAt } = await fetchCoinGecko<
      {
        id: string;
        current_price: number;
        price_change_percentage_7d_in_currency?: number;
      }[]
    >(
      `/coins/markets?vs_currency=usd&ids=${ids.ids.join(",")}&sparkline=false&price_change_percentage=7d`
    );

    const quotes: PriceQuote[] = data.map((coin) => ({
      id: coin.id,
      price: coin.current_price,
      change7d: coin.price_change_percentage_7d_in_currency ?? 0,
      ts: fetchedAt,
    }));

    return NextResponse.json(quotes, { headers: PRICE_RESPONSE_HEADERS });
  } catch (error) {
    console.error("Failed to fetch prices:", error);
    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 502, headers: PRICE_RESPONSE_HEADERS }
    );
  }
}
