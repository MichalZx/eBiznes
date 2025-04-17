package controllers

import play.api.mvc.*
import javax.inject.*
import scala.collection.mutable.ListBuffer
import play.api.libs.json.*
import models.Product

@Singleton
class ProductController @Inject()(cc: ControllerComponents) extends AbstractController(cc):

  private val products = ListBuffer(
    Product(1, "Laptop Acer", 3999.99, 1),
    Product(2, "Xiaomi", 499.99, 1),
    Product(3, "Lokomotywa", 14.99, 2),
    Product(4, "Tetris", 9.99, 3)
  )

  def list: Action[AnyContent] = Action {
    Ok(Json.toJson(products))
  }

  def get(id: Long): Action[AnyContent] = Action {
    products.find(_.id == id)
      .map(p => Ok(Json.toJson(p)))
      .getOrElse(NotFound)
  }

  def add: Action[JsValue] = Action(parse.json) { request =>
    request.body.validate[Product].map { product =>
      products += product
      Created(Json.toJson(product))
    }.getOrElse(BadRequest("Invalid JSON"))
  }

  def update(id: Long): Action[JsValue] = Action(parse.json) { request =>
    request.body.validate[Product].map { updated =>
      products.indexWhere(_.id == id) match
        case -1 => NotFound
        case i =>
          products.update(i, updated)
          Ok(Json.toJson(updated))
    }.getOrElse(BadRequest("Invalid JSON"))
  }

  def delete(id: Long): Action[AnyContent] = Action {
    products.indexWhere(_.id == id) match
      case -1 => NotFound
      case i =>
        products.remove(i)
        NoContent
  }
