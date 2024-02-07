interface User {
  rol: String,
  id: BigInteger,
  teamId: BigInteger,
  isLogIn: boolean,
  mail: String
}
const initialState: User = {
  rol : '',
  id : null,
  teamId : null,
  isLogIn: false,
  mail : ''
}


const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        rol: action.payload.rol,
        id: action.payload.id,
        teamId: action.payload.teamId,
        isLogIn: action.payload.isLogIn,
        mail :action.payload.mail
      };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
};

export {initialState, userReducer};