import { instance } from "gaxios";

instance.defaults = {
  headers: {
    "Content-type": "application/json",
  },
};

export { instance };
