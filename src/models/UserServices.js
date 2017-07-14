/**
 * Created by jojo on 2017/7/13.
 */
import ApiConfig from '../config/ApiConfig';

import request from '../utils/request';

import * as tools from '../utils/tools';

const {httpApi}=ApiConfig;

export async function login(payload) {

  const options={
    method:"GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }

  }
  return request(httpApi.LOGIN+tools.jsonToQueryString(payload),options);
}
