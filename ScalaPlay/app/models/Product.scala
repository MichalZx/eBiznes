package models

import play.api.libs.json.*

case class Product(id: Long, name: String, price: Double, categoryId: Long)

object Product:
  given Format[Product] = Json.format[Product]
