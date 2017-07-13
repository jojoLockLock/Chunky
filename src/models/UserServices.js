/**
 * Created by jojo on 2017/7/13.
 */
import ApiConfig from '../config/ApiConfig';
const {httpApi}=ApiConfig;
import request from '../utils/request';

import * as tools from '../utils/tools';
export async function login(payload) {

  const options={
    method:"GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }

  }
  return request(httpApi.LOGIN+tools.jsonToQueryString(payload),options);
}
