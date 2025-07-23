package com.example

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable

val scores = mutableListOf<ScoreRequest>(
)

@Serializable
data class ScoreRequest(val nickname: String, val score: Int)

@Serializable
data class ScoreResponse(val nickname: String, val score: Int)

fun Application.configureRouting() {
    routing {
        // 점수 저장
        post("/score") {
            val req = call.receive<ScoreRequest>()
            scores.add(req)
            call.respond(HttpStatusCode.OK, "Saved!")
        }

        // 랭킹 반환
        get("/ranking") {
            val top10 = scores
                .sortedByDescending { it.score }
                .take(10)
                .map { ScoreResponse(it.nickname, it.score) }

            call.respond(top10)
        }
    }
}
