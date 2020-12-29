import React, { useReducer } from "react";
import axios from "axios";
import AuthContext from "./authContext";
import authReducer from "./authReducer";
import setAuthToken from "../../utils/setAuthToken";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
  RESET_LINK_SEND,
  RESET_LINK_FAIL,
  RESET_SUCCESS,
  RESET_FAIL,
} from "../types";

const apiUrl = "https://m-drive-api.herokuapp.com";

const AuthState = (props) => {
  const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null,
    userRegistered: null,
    message: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load User
  const loadUser = async () => {
    setAuthToken(localStorage.token);

    try {
      const res = await axios.get(`${apiUrl}/api/users/`);

      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    } catch (err) {
      console.log(err.response.data.error);
      dispatch({
        type: AUTH_ERROR,
        payload: null,
      });
    }
  };

  // Register User
  const register = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.post(
        `${apiUrl}/api/users/register`,
        formData,
        config
      );

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response.data.error,
      });
    }
  };

  // Login User
  const login = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.post(
        `${apiUrl}/api/users/login`,
        formData,
        config
      );

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });

      loadUser();
    } catch (err) {
      console.log(err.response.data);
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response.data,
      });
    }
  };

  // Logout
  const logout = async () => {
    try {
      setAuthToken(localStorage.token);
      await axios.get(`${apiUrl}/api/users/logout`);
      dispatch({ type: LOGOUT });
    } catch (err) {
      console.log(err.response.data.error);
      dispatch({
        type: AUTH_ERROR,
        payload: err.response.data.error,
      });
    }
  };

  // Clear Errors
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  // Forgot Password
  const forgotPassword = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      let res = await axios.post(
        `${apiUrl}/api/users/forgot/password`,
        formData,
        config
      );

      dispatch({
        type: RESET_LINK_SEND,
        payload: res.data,
      });
    } catch (err) {
      console.log(err.response.data.error);
      dispatch({
        type: RESET_LINK_FAIL,
        payload: err.response.data.error,
      });
    }
  };

  // Reset Password
  const resetPassword = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      let res = await axios.put(
        `${apiUrl}/api/users/reset/password`,
        formData,
        config
      );

      dispatch({
        type: RESET_SUCCESS,
        payload: res.data,
      });
    } catch (err) {
      console.log(err.response.data);
      dispatch({
        type: RESET_FAIL,
        payload: err.response.data,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        userRegistered: state.userRegistered,
        error: state.error,
        message: state.message,
        register,
        loadUser,
        login,
        logout,
        clearErrors,
        forgotPassword,
        resetPassword,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
