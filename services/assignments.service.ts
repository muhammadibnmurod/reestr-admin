import api from '~/utils/axios';

// Unassign an employee (or PM) from a project
export const unassignEmployeeFromProject = ({ projectId, employeeId }: { projectId: number, employeeId: number }) => {
  return api.delete(`/assignment/${projectId}/${employeeId}`);
};

// Assign an employee to a project
export const assignEmployeeToProject = ({ projectId, employeeId }: { projectId: number, employeeId: number }) => {
  return api.post(`/assignment/${projectId}/${employeeId}`);
};
