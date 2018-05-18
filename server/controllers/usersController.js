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


}
