// Автосгенерированный клиент API
// Сгенерировано из https://reestr.das-uty.uz/api/docs-json

import type { paths } from './apiMethods.types';
export const apiMethods = (options?: any) => {
  return {
    Projects: {
      ProjectController_getGanttChart: (id: string | number) => useApi<paths['/api/project/gantt-chart/{id}']['get']['responses']['200']['content']['application/json']>(`/api/project/gantt-chart/${id}`, { method: 'GET', ...options }),
      ProjectController_getAll: (query?: paths['/api/project']['get']['parameters']['query']) => useApi<paths['/api/project']['get']['responses']['200']['content']['application/json']>(`/api/project`, { method: 'GET', params: query, ...options }),
      ProjectController_create: (body: paths['/api/project']['post']['requestBody']['content']['application/json']) => useApi<paths['/api/project']['post']['responses']['201']>(`/api/project`, { method: 'POST', body: body, ...options }),
      ProjectController_getStatistic: (query?: paths['/api/project/statistic']['get']['parameters']['query']) => useApi<paths['/api/project/statistic']['get']['responses']['200']['content']['application/json']>(`/api/project/statistic`, { method: 'GET', params: query, ...options }),
      ProjectController_getById: (id: string | number) => useApi<paths['/api/project/{id}']['get']['responses']['200']['content']['application/json']>(`/api/project/${id}`, { method: 'GET', ...options }),
      ProjectController_update: (id: string | number, body: paths['/api/project/{id}']['put']['requestBody']['content']['application/json']) => useApi<paths['/api/project/{id}']['put']['responses']['200']>(`/api/project/${id}`, { method: 'PUT', body: body, ...options }),
      ProjectController_delete: (id: string | number) => useApi<void>(`/api/project/${id}`, { method: 'DELETE', ...options }),
      ProjectController_getAllByEmployeeId: (employeeId: string | number) => useApi<paths['/api/project/employee/{employeeId}']['get']['responses']['200']['content']['application/json']>(`/api/project/employee/${employeeId}`, { method: 'GET', ...options }),
    },
    Files: {
      FileController_upload: (formData: paths['/api/files']['post']['requestBody']['content']['multipart/form-data']) => useApi<paths['/api/files']['post']['responses']['201']['content']['application/json']>(`/api/files`, { method: 'POST', formData: formData, ...options }),
    },
    Employees: {
      EmployeeController_findAll: (query?: paths['/api/employee']['get']['parameters']['query']) => useApi<paths['/api/employee']['get']['responses']['200']>(`/api/employee`, { method: 'GET', params: query, ...options }),
      EmployeeController_create: (body: paths['/api/employee']['post']['requestBody']['content']['application/json']) => useApi<paths['/api/employee']['post']['responses']['201']['content']['application/json']>(`/api/employee`, { method: 'POST', body: body, ...options }),
      EmployeeController_update: (id: string | number, body: paths['/api/employee/{id}']['put']['requestBody']['content']['application/json']) => useApi<paths['/api/employee/{id}']['put']['responses']['200']['content']['application/json']>(`/api/employee/${id}`, { method: 'PUT', body: body, ...options }),
      EmployeeController_delete: (id: string | number) => useApi<void>(`/api/employee/${id}`, { method: 'DELETE', ...options }),
      EmployeeController_getAllByProjectID: (projectId: string | number) => useApi<paths['/api/employee/{projectId}']['get']['responses']['200']['content']['application/json']>(`/api/employee/${projectId}`, { method: 'GET', ...options }),
    },
    Project_Image: {
      ProjectImageController_getAllByProjectId: (projectId: string | number) => useApi<paths['/api/project/image/{projectId}']['get']['responses']['200']['content']['application/json']>(`/api/project/image/${projectId}`, { method: 'GET', ...options }),
      ProjectImageController_create: (projectId: string | number, body: paths['/api/project/image/{projectId}']['post']['requestBody']['content']['application/json']) => useApi<paths['/api/project/image/{projectId}']['post']['responses']['201']>(`/api/project/image/${projectId}`, { method: 'POST', body: body, ...options }),
      ProjectImageController_delete: (id: string | number) => useApi<void>(`/api/project/image/${id}`, { method: 'DELETE', ...options }),
    },
    Project_Module: {
      ProjectModuleController_dragAndDrop: (body: paths['/api/module/change-order']['put']['requestBody']['content']['application/json']) => useApi<paths['/api/module/change-order']['put']['responses']['200']>(`/api/module/change-order`, { method: 'PUT', body: body, ...options }),
      ProjectModuleController_create: (body: paths['/api/module']['post']['requestBody']['content']['application/json']) => useApi<paths['/api/module']['post']['responses']['201']>(`/api/module`, { method: 'POST', body: body, ...options }),
      ProjectModuleController_getById: (id: string | number) => useApi<paths['/api/module/{id}']['get']['responses']['200']['content']['application/json']>(`/api/module/${id}`, { method: 'GET', ...options }),
      ProjectModuleController_update: (id: string | number, body: paths['/api/module/{id}']['put']['requestBody']['content']['application/json']) => useApi<paths['/api/module/{id}']['put']['responses']['200']>(`/api/module/${id}`, { method: 'PUT', body: body, ...options }),
      ProjectModuleController_delete: (id: string | number) => useApi<void>(`/api/module/${id}`, { method: 'DELETE', ...options }),
      ProjectModuleController_getAllByProjectId: (projectId: string | number) => useApi<paths['/api/module/project/{projectId}']['get']['responses']['200']>(`/api/module/project/${projectId}`, { method: 'GET', ...options }),
    },
    Submodule: {
      SubmoduleController_dragAndDrop: (body: paths['/api/submodule/change-order']['put']['requestBody']['content']['application/json']) => useApi<paths['/api/submodule/change-order']['put']['responses']['200']>(`/api/submodule/change-order`, { method: 'PUT', body: body, ...options }),
      SubmoduleController_create: (body: paths['/api/submodule']['post']['requestBody']['content']['application/json']) => useApi<paths['/api/submodule']['post']['responses']['201']>(`/api/submodule`, { method: 'POST', body: body, ...options }),
      SubmoduleController_update: (id: string | number, body: paths['/api/submodule/{id}']['put']['requestBody']['content']['application/json']) => useApi<paths['/api/submodule/{id}']['put']['responses']['200']>(`/api/submodule/${id}`, { method: 'PUT', body: body, ...options }),
      SubmoduleController_delete: (id: string | number) => useApi<void>(`/api/submodule/${id}`, { method: 'DELETE', ...options }),
      SubmoduleController_getAllByModuleId: (moduleId: string | number) => useApi<paths['/api/submodule/{moduleId}']['get']['responses']['200']['content']['application/json']>(`/api/submodule/${moduleId}`, { method: 'GET', ...options }),
    },
    Documents: {
      DocumentController_getAllDocuments: (projectId: string | number) => useApi<paths['/api/document/{projectId}']['get']['responses']['200']>(`/api/document/${projectId}`, { method: 'GET', ...options }),
      DocumentController_getAllExtraDocuments: (projectId: string | number) => useApi<paths['/api/document/extra/{projectId}']['get']['responses']['200']>(`/api/document/extra/${projectId}`, { method: 'GET', ...options }),
      DocumentController_createExtra: (body: paths['/api/document/extra']['post']['requestBody']['content']['application/json']) => useApi<paths['/api/document/extra']['post']['responses']['201']>(`/api/document/extra`, { method: 'POST', body: body, ...options }),
      DocumentController_deleteExtra: (id: string | number) => useApi<void>(`/api/document/extra/${id}`, { method: 'DELETE', ...options }),
      DocumentController_updateExtra: (id: string | number, body: paths['/api/document/update/{id}']['put']['requestBody']['content']['application/json']) => useApi<paths['/api/document/update/{id}']['put']['responses']['200']>(`/api/document/update/${id}`, { method: 'PUT', body: body, ...options }),
      DocumentController_dragAndDrop: (body: paths['/api/document/change-order']['put']['requestBody']['content']['application/json']) => useApi<paths['/api/document/change-order']['put']['responses']['200']>(`/api/document/change-order`, { method: 'PUT', body: body, ...options }),
    },
    DocumentCategory: {
      DocumentCategoryController_findAll: () => useApi<paths['/api/document-category']['get']['responses']['200']>('/api/document-category', { method: 'GET', ...options }),
      DocumentCategoryController_create: (body: paths['/api/document-category']['post']['requestBody']['content']['application/json']) => useApi<paths['/api/document-category']['post']['responses']['201']>(`/api/document-category`, { method: 'POST', body: body, ...options }),
      DocumentCategoryController_update: (body: paths['/api/document-category']['put']['requestBody']['content']['application/json']) => useApi<paths['/api/document-category']['put']['responses']['200']>(`/api/document-category`, { method: 'PUT', body: body, ...options }),
      DocumentCategoryController_delete: (id: string | number) => useApi<void>(`/api/document-category/${id}`, { method: 'DELETE', ...options }),
    },
    Auth: {
      AuthController_login: (body: paths['/api/auth/login']['post']['requestBody']['content']['application/json']) => useApi<paths['/api/auth/login']['post']['responses']['200']['content']['application/json']>(`/api/auth/login`, { method: 'POST', body: body, ...options }),
      AuthController_refresh: (body: paths['/api/auth/refresh']['post']['requestBody']['content']['application/json']) => useApi<paths['/api/auth/refresh']['post']['responses']['200']['content']['application/json']>(`/api/auth/refresh`, { method: 'POST', body: body, ...options }),
    },
    User: {
      UserController_getMe: () => useApi<paths['/api/user/me']['get']['responses']['200']>('/api/user/me', { method: 'GET', ...options }),
      UserController_getAll: () => useApi<paths['/api/user']['get']['responses']['200']['content']['application/json']>('/api/user', { method: 'GET', ...options }),
      UserController_create: (body: paths['/api/user']['post']['requestBody']['content']['application/json']) => useApi<paths['/api/user']['post']['responses']['201']['content']['application/json']>(`/api/user`, { method: 'POST', body: body, ...options }),
      UserController_getById: (id: string | number) => useApi<paths['/api/user/{id}']['get']['responses']['200']['content']['application/json']>(`/api/user/${id}`, { method: 'GET', ...options }),
      UserController_update: (id: string | number, body: paths['/api/user/{id}']['put']['requestBody']['content']['application/json']) => useApi<paths['/api/user/{id}']['put']['responses']['200']['content']['application/json']>(`/api/user/${id}`, { method: 'PUT', body: body, ...options }),
      UserController_delete: (id: string | number) => useApi<void>(`/api/user/${id}`, { method: 'DELETE', ...options }),
      UserController_createDefaultUser: (query?: paths['/api/user/default']['post']['parameters']['query']) => useApi<paths['/api/user/default']['post']['responses']['201']>(`/api/user/default`, { method: 'POST', params: query, ...options }),
    },
    Assignment: {
      AssignmentController_assignEmployeeToProject: (body: paths['/api/assignment/project']['post']['requestBody']['content']['application/json']) => useApi<paths['/api/assignment/project']['post']['responses']['200']>(`/api/assignment/project`, { method: 'POST', body: body, ...options }),
      AssignmentController_unAssignEmployeeFromProject: () => useApi<paths['/api/assignment/project']['delete']['responses']['200']>('/api/assignment/project', { method: 'DELETE', ...options }),
      AssignmentController_assignEmployeeToSubmodule: (body: paths['/api/assignment/submodule']['post']['requestBody']['content']['application/json']) => useApi<paths['/api/assignment/submodule']['post']['responses']['200']>(`/api/assignment/submodule`, { method: 'POST', body: body, ...options }),
      AssignmentController_unAssignEmployeeFromSubmodule: () => useApi<paths['/api/assignment/submodule']['delete']['responses']['200']>('/api/assignment/submodule', { method: 'DELETE', ...options }),
    },
    Presentation: {
      PresentationController_getAll: () => useApi<paths['/api/presentation']['get']['responses']['200']>('/api/presentation', { method: 'GET', ...options }),
      PresentationController_create: (body: paths['/api/presentation']['post']['requestBody']['content']['application/json']) => useApi<paths['/api/presentation']['post']['responses']['201']>(`/api/presentation`, { method: 'POST', body: body, ...options }),
      PresentationController_getById: (id: string | number) => useApi<paths['/api/presentation/{id}']['get']['responses']['200']>(`/api/presentation/${id}`, { method: 'GET', ...options }),
      PresentationController_update: (id: string | number, body: paths['/api/presentation/{id}']['put']['requestBody']['content']['application/json']) => useApi<paths['/api/presentation/{id}']['put']['responses']['200']>(`/api/presentation/${id}`, { method: 'PUT', body: body, ...options }),
      PresentationController_delete: (id: string | number) => useApi<void>(`/api/presentation/${id}`, { method: 'DELETE', ...options }),
      PresentationController_dragAndDrop: (body: paths['/api/presentation/change-order']['put']['requestBody']['content']['application/json']) => useApi<paths['/api/presentation/change-order']['put']['responses']['200']>(`/api/presentation/change-order`, { method: 'PUT', body: body, ...options }),
    },
    translate_API: {
      TranslateController_handleBatch: (body: paths['/api/translate']['post']['requestBody']['content']['application/json']) => useApi<paths['/api/translate']['post']['responses']['201']>(`/api/translate`, { method: 'POST', body: body, ...options }),
    },
    Customer: {
      CustomerController_getAll: (query?: paths['/api/customer']['get']['parameters']['query']) => useApi<paths['/api/customer']['get']['responses']['200']>(`/api/customer`, { method: 'GET', params: query, ...options }),
      CustomerController_create: (body: paths['/api/customer']['post']['requestBody']['content']['application/json']) => useApi<paths['/api/customer']['post']['responses']['201']>(`/api/customer`, { method: 'POST', body: body, ...options }),
      CustomerController_get: (id: string | number) => useApi<paths['/api/customer/{id}']['get']['responses']['200']>(`/api/customer/${id}`, { method: 'GET', ...options }),
      CustomerController_update: (id: string | number, body: paths['/api/customer/{id}']['put']['requestBody']['content']['application/json']) => useApi<paths['/api/customer/{id}']['put']['responses']['200']>(`/api/customer/${id}`, { method: 'PUT', body: body, ...options }),
      CustomerController_delete: (id: string | number) => useApi<void>(`/api/customer/${id}`, { method: 'DELETE', ...options }),
    },
  };
};
