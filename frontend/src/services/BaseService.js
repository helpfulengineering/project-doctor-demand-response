import React from "react";
import FormUtil from "../utils/form-util";

export class BaseService {
  static applicationContext = React.createContext({});

  static getAppContext() {
    return this.applicationContext._currentValue;
  }

  static getUserContext() {
    let user = localStorage.getItem('user');

    if(!FormUtil.isEmpty(user)) {
      console.log(user);
      return JSON.parse(user);
    }
    return {};
  }

  static getBaseUrl() {
      return "http://localhost:3000";
  }
}