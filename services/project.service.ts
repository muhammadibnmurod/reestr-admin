import api from '~/utils/axios';

// Fetch a project by its ID
export const getProjectById = (projectId: number) => {
  return api.get(`/project/${projectId}`);
};

// Update a project by its ID
export const updateProject = (projectId: number, data: any) => {
  return api.put(`/project/${projectId}`, data);
};
