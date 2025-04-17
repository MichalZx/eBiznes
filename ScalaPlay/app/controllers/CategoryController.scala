package controllers

import play.api.mvc.*
import javax.inject.*
import scala.collection.mutable.ListBuffer
import play.api.libs.json.*
import models.Category

@Singleton
class CategoryController @Inject()(cc: ControllerComponents) extends AbstractController(cc):

  private val categories = ListBuffer(
    Category(1, "Electronics"),
    Category(2, "Books"),
    Category(3, "Games")
  )

  def list: Action[AnyContent] = Action {
    Ok(Json.toJson(categories))
  }

  def get(id: Long): Action[AnyContent] = Action {
    categories.find(_.id == id)
      .map(c => Ok(Json.toJson(c)))
      .getOrElse(NotFound)
  }

  def add: Action[JsValue] = Action(parse.json) { request =>
    request.body.validate[Category].map { category =>
      categories += category
      Created(Json.toJson(category))
    }.getOrElse(BadRequest("Invalid JSON"))
  }

  def update(id: Long): Action[JsValue] = Action(parse.json) { request =>
    request.body.validate[Category].map { updated =>
      categories.indexWhere(_.id == id) match
        case -1 => NotFound
        case i =>
          categories.update(i, updated)
          Ok(Json.toJson(updated))
    }.getOrElse(BadRequest("Invalid JSON"))
  }

  def delete(id: Long): Action[AnyContent] = Action {
    categories.indexWhere(_.id == id) match
      case -1 => NotFound
      case i =>
        categories.remove(i)
        NoContent
  }
