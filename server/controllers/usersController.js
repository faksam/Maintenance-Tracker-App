import uuid from 'uuid';
// import json file
import usersRequest from '../db/usersRequest.json';

/**
 * @class usersController
 *
 * @export
 */
export default class usersController {
/**
   * @description - Get all Requests
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberOf usersController
   *
   * @returns {object} response JSON Object
   */
  static getRequests(req, res) {
    const data = usersRequest.requests;
    res.status(200).send({
      success: true,
      status: 200,
      data
    });
  }


  /**
   * @description - Get a Request
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberOf usersController
   *
   * @returns {object} response JSON Object
   */
  static getRequest(req, res) {
    const requestId = parseInt(req.params.id, 10);
    /**
     * @description - Finds request
     * @param {request} request - UserRequest
     *
     * @returns {object} Class Instance
     */
    function findRequest(request) {
      return request.id === requestId;
    }
    const data = usersRequest.requests.find(findRequest);
    res.status(200).send({
      success: true,
      status: 200,
      data
    });
  }

  /**
   * @description - Add a new Request
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberOf usersController
   *
   * @returns {object} response JSON Object
   */
  static postRequest(req, res) {
    const newRequest = {};

    newRequest.id = usersRequest.requests.length + 1;
    newRequest.title = req.body.title;
    newRequest.date = new Date();
    newRequest.status = 'New';
    newRequest.description = req.body.description;
    newRequest.userId = uuid.v4();

    usersRequest.requests.push(newRequest);
    res.status(201).send({
      success: true,
      status: 201,
      data: newRequest
    });
  }

  /**
   * @description - Update a Request
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberOf usersController
   *
   * @returns {object} response JSON Object
   */
  static updateRequest(req, res) {
    let foundRequest;
    const requestId = parseInt(req.params.id, 10);
    usersRequest.requests.forEach((element, index) => {
      if (element.id === requestId) {
        foundRequest = element;
        foundRequest.title = req.body.title;
        foundRequest.description = req.body.description;
        usersRequest.requests[index] = foundRequest;
        return res.status(200).send({
          success: true,
          status: 200,
          data: foundRequest
        });
      }
    });
  }
}
