// import json file
import usersRequest from '../db/usersRequest.json';

export default class usersController {
  /*
   * GET /request route to retrieve all the requests.
   */
  static getRequests(req, res) {
    function filterByUserID(item) {
      if (item.userId === 1) {
        return true;
      }
      return false;
    }
    const currentUserRequests = usersRequest.requests.filter(filterByUserID);
    res.status(200).send({ currentUserRequests });
  }

  /*
   * POST /request to save a new request.
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

  /*
   * GET /request/:id route to retrieve a request given its id.
   */
  static getRequest(req, res) {
    function findRequest(request) {
      return request.id === req.params.id;
    }
    res.send(usersRequest.requests.find(findRequest));
  }

  /*
   * PUT /request/:id to updatea a request given its id
   */
  static updateRequest(req, res) {
    let requestChecker = false;
    let foundRequest;
    usersRequest.requests.forEach((element, index) => {
      requestChecker = true;
      if (element.id === req.params.id) {
        foundRequest = element;
        foundRequest.title = req.body.title;
        foundRequest.description = req.body.description;
        usersRequest.requests[index] = foundRequest;
      }
      return res.status(200).send(foundRequest);
    });
    if (!requestChecker) {
      res.status(404).send(usersRequest);
    }
  }
}
