// store/route.ts
"use server"

import { NextRequest } from "next/server"
import { StoreData } from "../../../lib/store-ai"

const stores = new Map<string, StoreData>() // In-memory for demo

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json()

    if (!action) {
      return badRequest("Missing action parameter")
    }

    switch (action) {
      case "save": {
        if (!data?.id || typeof data.id !== "string") {
          return badRequest("Store ID is required")
        }

        // You could add schema validation here using zod or yup
        stores.set(data.id, data)
        return success({ message: "Store saved", id: data.id })
      }

      case "get": {
        const id = data?.id
        if (!id || typeof id !== "string") {
          return badRequest("Store ID is required")
        }

        const store = stores.get(id)
        if (!store) {
          return notFound("Store not found")
        }

        return success(store)
      }

      case "list": {
        const allStores = Array.from(stores.entries()).map(([id, store]) => ({
          id,
          name: store.name,
          domain: store.domain,
        }))
        return success(allStores)
      }

      default:
        return badRequest("Invalid action")
    }
  } catch (error: any) {
    console.error("❌ Store API Error:", error)
    return serverError("Internal server error")
  }
}

// 💡 Utility responses
function success(data: any) {
  return new Response(JSON.stringify(data), { status: 200, headers: jsonHeaders })
}

function badRequest(message: string) {
  return new Response(JSON.stringify({ error: message }), { status: 400, headers: jsonHeaders })
}

function notFound(message: string) {
  return new Response(JSON.stringify({ error: message }), { status: 404, headers: jsonHeaders })
}

function serverError(message: string) {
  return new Response(JSON.stringify({ error: message }), { status: 500, headers: jsonHeaders })
}

const jsonHeaders = { "Content-Type": "application/json" }
