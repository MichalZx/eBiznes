package models

import play.api.libs.json.*

case class Cart(id: Long, productId: List[Long])

object Cart:
  given Format[Cart] = Json.format[Cart]
