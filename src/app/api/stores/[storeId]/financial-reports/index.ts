import { NextRequest, NextResponse } from "next/server";

import { URLParamsType } from "@/types/app-config-server";

import { apiHandler } from "@/middlewares/route-handler";
import FinalcialReport from "@/models/server/db/FinancialReport";

export const GET = (req: NextRequest, { params: { storeId } }: URLParamsType) => {
    return apiHandler(req, async ({ mongoDbConfig, user }) => {
        const financialReports = await FinalcialReport.getAll({ storeId }, { mongoDbConfig, user })

        return NextResponse.json(financialReports)
    })
}


