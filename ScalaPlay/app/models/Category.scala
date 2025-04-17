package models

import play.api.libs.json.*

case class Category(id: Long, name: String)

object Category:
  given Format[Category] = Json.format[Category]
