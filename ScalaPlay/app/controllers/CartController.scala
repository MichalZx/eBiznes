package controllers

import play.api.mvc.*
import javax.inject.*
import scala.collection.mutable.ListBuffer
import play.api.libs.json.*
import models.Cart

@Singleton
class CartController @Inject()(cc: ControllerComponents) extends AbstractController(cc):

  private val carts = ListBuffer[Cart]()

  def list: Action[AnyContent] = Action {
    Ok(Json.toJson(carts))
  }

  def get(id: Long): Action[AnyContent] = Action {
    carts.find(_.id == id)
      .map(c => Ok(Json.toJson(c)))
      .getOrElse(NotFound)
  }

  def add: Action[JsValue] = Action(parse.json) { request =>
    request.body.validate[Cart].map { cart =>
      carts += cart
      Created(Json.toJson(cart))
    }.getOrElse(BadRequest("Invalid JSON"))
  }

  def update(id: Long): Action[JsValue] = Action(parse.json) { request =>
    request.body.validate[Cart].map { updated =>
      carts.indexWhere(_.id == id) match
        case -1 => NotFound
        case i =>
          carts.update(i, updated)
          Ok(Json.toJson(updated))
    }.getOrElse(BadRequest("Invalid JSON"))
  }

  def delete(id: Long): Action[AnyContent] = Action {
    carts.indexWhere(_.id == id) match
      case -1 => NotFound
      case i =>
        carts.remove(i)
        NoContent
  }
