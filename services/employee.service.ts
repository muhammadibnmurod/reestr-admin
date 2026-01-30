import api from '~/utils/axios';

export const getAllEmployees = () => {
  return api.get('/employee');
}

export const getEmployeesByProjectId = (projectId: number) => {
  return api.get(`/employee/${projectId}`);
};
