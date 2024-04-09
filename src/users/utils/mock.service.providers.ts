export const rabbitmqServiceProvider = {
  sendAccountCreationEvent: jest.fn(),
};

export const mailsServiceProvider = {
  sendCreationEmail: jest.fn(),
};

export const imagesServiceProvider = {
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};
