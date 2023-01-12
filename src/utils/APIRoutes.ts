// import 'dotenv/config';

export const host = process.env.SERVER_URL || 'http://localhost:4000';

// const SERVER_URL = 'http://localhost:4000';

// export const host = SERVER_URL;
export const loginRoute = `${host}/api/users/login`;
export const registerRoute = `${host}/api/users/signup`;
export const userInfoRoute = `${host}/api/users/info`;
