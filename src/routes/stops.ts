import { Router } from "express";
import { stopsController } from "../controllers/stopsController";

const router = Router();

//GET TASKS AS JSON
router.route("/blue").get(stopsController.getBlueStops);

router.route("/red").get(stopsController.getRedStops);

router.route("/orange").get(stopsController.getOrangeStops);

router.route("/green").get(stopsController.getGreenStops);

router.route("/all").get(stopsController.getAllStops);

router.route("/orange/coordinates").get(stopsController.getOrangeCoordinates);

router.route("/blue/coordinates").get(stopsController.getBlueCoordinates);

router.route("/red/coordinates").get(stopsController.getRedCoordinates);

router.route("/polyline").get(stopsController.getSomePolyline);

export default router;
