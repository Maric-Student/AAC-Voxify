import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || ""

    // If no query is provided, fetch all pictograms
    const url = query
      ? `https://api.arasaac.org/api/pictograms/en/search/${encodeURIComponent(query)}`
      : "https://api.arasaac.org/v1/pictograms/all/en"

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Arasaac API responded with status: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Error fetching from Arasaac API:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch pictograms",
      },
      { status: 500 },
    )
  }
}
