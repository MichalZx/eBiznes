import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import io.github.cdimascio.dotenv.dotenv
import io.ktor.client.statement.*

@Serializable
data class DiscordMessage(val content: String)

@Serializable
data class Author(val id: String, val username: String)

@Serializable
data class DiscordMessageResponse(
    val id: String,
    val content: String,
    val author: Author
)

fun main() = runBlocking {
    val dotenv = dotenv()
    val token = dotenv["DISCORD_TOKEN"]
    val channelId = dotenv["DISCORD_CHANNEL_ID"]

    val categories = mutableListOf("Filmy", "Książki", "Gry", "Utwory")
    val products = mapOf(
        "Filmy" to listOf("Interstellar", "Incepcja"),
        "Książki" to listOf("Wiedźmin", "Harry Potter"),
        "Gry" to listOf("Cyberpunk 2077", "Wiedźmin 3"),
        "Utwory" to listOf("Eye of the tiger", "Highway to hell")
    )

    val client = HttpClient(CIO) {
        install(ContentNegotiation) {
            json(Json {
                ignoreUnknownKeys = true
            })
        }
    }
    try {
        val response = client.post("https://discord.com/api/v10/channels/$channelId/messages") {
            contentType(ContentType.Application.Json)
            header(HttpHeaders.Authorization, "Bot $token")
            setBody(DiscordMessage("Hello world!"))
        }
        println("Status: ${response.status}")
//        println("Response: ${response.body<String>()}")
    } catch (e: Exception) {
        println("Error_1: ${e.message}")
    }
    var lastMessageId: String? = null

    println("Working...")

    try {
        while (true) {
            val response = client.get("https://discord.com/api/v10/channels/$channelId/messages") {
                header(HttpHeaders.Authorization, "Bot $token")
            }
            val messages: List<DiscordMessageResponse> = response.body()
            if (messages.isNotEmpty()) {
                val latestMessage = messages[0]
                if (latestMessage.id != lastMessageId) {
                    val author = latestMessage.author.username
                    val content = latestMessage.content.trim()

                    println("User $author send message: $content")

                    if (content.equals("/kategorie", ignoreCase = true)) {
                        val reply = "Dostępne kategorie:\n" + categories.joinToString("\n") { "* $it" }
                        sendMessage(client, token, channelId, reply)

                    }
                    else if (content.startsWith("/produkty", ignoreCase = true)) {
                        val parts = content.split(" ", limit = 2)
                        if (parts.size < 2) {
                            sendMessage(client, token, channelId, "Użycie: /produkty <kategoria>")
                        } else {
                            val requestedCatergory = parts[1].trim()
                            val listProducts = products[requestedCatergory]

                            val reply = if (listProducts != null) {
                                if (listProducts.isNotEmpty()) {
                                    "Produkty w kategorii \"$requestedCatergory\":\n" +
                                            listProducts.joinToString("\n") { "* $it" }
                                } else {
                                    "Brak produktów w kategorii \"$requestedCatergory\""
                                }
                            } else {
                                "Błędna kategoria: \"$requestedCatergory\"\n" +
                                        "Dostępne kategorie:\n" + products.keys.joinToString("\n") { "* $it" }
                            }
                            sendMessage(client, token, channelId, reply)
                        }
                    }
                    lastMessageId = latestMessage.id
                }
            }
            delay(5000)
        }
    } catch (e: Exception) {
        println("Error_2: ${e.message}")
    } finally {
        client.close()
    }
}

suspend fun sendMessage(client: HttpClient, token: String, channelId: String, reply: String) {
    val postResponse: HttpResponse = client.post("https://discord.com/api/v10/channels/$channelId/messages") {
        contentType(ContentType.Application.Json)
        header(HttpHeaders.Authorization, "Bot $token")
        setBody(DiscordMessage(reply))
    }
//    println("Reply: ${postResponse.status}")
}
