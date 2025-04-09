export const regularExp = {
  name: /^[A-ZÁÉÍÓÚÑa-záéíóúñ]+(?: [A-ZÁÉÍÓÚÑa-záéíóúñ]+)*$/,
  email: /^[a-zA-z0-9._-]+@[a-zA-z0-9.-]+\.[a-zA-Z]{2,6}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\w)(?=.*[a-zA-Z]).{10,16}$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  amount: /^(?!0(\.0{1,2})?$)\d{1,8}(\.\d{1,2})?$/,
  accountNumber: /^\d{10,20}$/,
};
