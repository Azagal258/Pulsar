import express from "express"
import dotenv from "dotenv"
import rateLimit from "express-rate-limit"

dotenv.config()

const app = express()
app.use(express.json())

const cache = new Map()

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30
})
// reuses logic of the fetch
async function apolloFetch(path, options = {}) {
    const response = await fetch(`https://apollo.cafe${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "Authorization": process.env.APOLLO_TOKEN,
            ...(options.headers || {})
        }
    })

    if (!response.ok) {
        throw new Error(`Apollo error: ${response.status}`);
    }
    return response.json()
}


app.use("/api/", limiter)

// search bar endpoint
app.get("/api/user/search", async (request, response) => {
    const query = request.query.query

    if (!query || !query.trim()) {
        return response.status(400).json({
            error: "Missing query"
        })
    }

    const cacheKey = `search:${query}`

    if (cache.has(cacheKey)) {
        return response.json(cache.get(cacheKey))
    }

    try {
        const data = await apolloFetch(
            `/api/bff/v3/users/search?query=${encodeURIComponent(query)}`
        )

        cache.set(cacheKey, data)

        setTimeout(() => {
            cache.delete(cacheKey)
        }, 2 * 60 * 1000)

        return response.json(data)

    } catch (err) {
        console.error(err)
        response.status(500).json({ error: "Search failed" })
    }
})

// username per address endpoint
app.post("/api/user/by-address", async (request, response) => {
    const { address } = request.body

    if (!address) {
        return response.status(400).json({
            error: "Missing address"
        })
    }

    const cacheKey = `addr:${address}`
    if (cache.has(cacheKey)) {
        return response.json(cache.get(cacheKey))
    }

    try {
        const data = await apolloFetch(
            "/api/user/by-addresses",
            {
                method: "POST",
                body: JSON.stringify({
                    addresses: [address]
                })
            }
        )

        cache.set(cacheKey, data)

        setTimeout(() => {
            cache.delete(cacheKey)
        }, 5 * 60 * 1000)

        return response.json(data)

    } catch (err) {
        console.error(err)
        response.status(500).json({
            error: "Failed to fetch Apollo API"
        })
    }
})

app.listen(process.env.PORT, () => {
    console.log("Backend running")
})