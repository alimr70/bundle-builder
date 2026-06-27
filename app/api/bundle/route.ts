import { NextResponse } from "next/server";
import {
  isValidBundleState,
  readBundle,
  writeBundle,
} from "@/lib/bundle-storage";

export const dynamic = "force-dynamic";

export const GET = async (): Promise<NextResponse> => {
  try {
    const bundle = await readBundle();

    if (!bundle) {
      return NextResponse.json({ data: null }, { status: 404 });
    }

    return NextResponse.json({ data: bundle });
  } catch (error) {
    console.error("Failed to read bundle:", error);
    return NextResponse.json(
      { message: "Failed to read saved bundle." },
      { status: 500 },
    );
  }
};

export const PUT = async (request: Request): Promise<NextResponse> => {
  try {
    const body: unknown = await request.json();

    if (!isValidBundleState(body)) {
      return NextResponse.json(
        { message: "Invalid bundle state payload." },
        { status: 400 },
      );
    }

    await writeBundle(body);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save bundle:", error);
    return NextResponse.json(
      { message: "Failed to save bundle." },
      { status: 500 },
    );
  }
};
