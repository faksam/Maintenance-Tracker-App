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
   * @returns {object} Class Instance
   */
  static getRequests(req, res) {
    /**
     * @description - Finds request
     * @param {request} item - UserRequest
     *
     * @returns {boolean} Class Instance
     */
    function filterByUserID(item) {
      if (item.userId === 1) {
        return true;
      }
      return false;
    }
    const currentUserRequests = usersRequest.requests.filter(filterByUserID);
    res.status(200).send({ currentUserRequests });
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
   * @returns {object} Class Instance
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
    const foundRequest = usersRequest.requests.find(findRequest);
    res.status(200).send(foundRequest);
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
   * @returns {object} Class Instance
   */
  static postRequest(req, res) {
    const newRequest = {};

    newRequest.id = usersRequest.requests.length + 1;
    newRequest.title = req.body.title;
    newRequest.date = new Date();
    newRequest.status = 'New';
    newRequest.description = req.body.description;
    newRequest.userId = 2;

    usersRequest.requests.push(newRequest);
    res.status(201).send(newRequest);
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
   * @returns {object} Class Instance
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
        return res.status(200).send(foundRequest);
      }
    });
  }
}
