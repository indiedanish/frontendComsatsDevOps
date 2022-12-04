import React, { useState, useEffect, useLayoutEffect } from "react";
import { useFormik } from "formik";
import PageWrapper from "../../../layout/PageWrapper/PageWrapper";
import SubHeader, {
  SubHeaderLeft,
  SubHeaderRight,
  SubheaderSeparator,
} from "../../../layout/SubHeader/SubHeader";
import Page from "../../../layout/Page/Page";
import { adminMenu } from "../../../menu";

import { getFirstLetter, priceFormat } from "../../../helpers/helpers";

import PaginationButtons, {
  dataPagination,
  PER_COUNT,
} from "../../../components/PaginationButtons";

import Icon from "../../../components/icon/Icon";

import Dropdown, {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "../../../components/bootstrap/Dropdown";
import Card, { CardBody } from "../../../components/bootstrap/Card";
import Input from "../../../components/bootstrap/forms/Input";
import Button from "../../../components/bootstrap/Button";
import useSortableData from "../../../hooks/useSortableData";
// import DeliverableAddModal from "./DeliverableAddModal";
// import DeliverableEditModal from "./DeliverableEditModal";
import { getColorNameWithIndex } from "../../../common/data/enumColors";
import useDarkMode from "../../../hooks/useDarkMode";

import axios from "axios";
axios.defaults.withCredentials = true;
import useAuth from "../../../hooks/useAuth";

import { Cookies } from "react-cookie";
import jwt_decode from "jwt-decode";
import Swal from "sweetalert2";

const Profile = () => {
  return(
    <div>
    <h2>Hdakjsdaskdjalsdji</h2>
  </div>


  )
  

};

export default Profile;