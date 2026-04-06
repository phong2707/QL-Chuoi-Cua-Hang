import { Router } from 'express';

export function resource(router: Router, name: string, controller: any) {
  // Bind all methods to controller instance
  const boundMethods: Record<string, any> = {};
  const methods = ['index', 'show', 'new', 'edit', 'create', 'update', 'destroy'];

  methods.forEach(method => {
    if (typeof controller[method] === 'function') {
      boundMethods[method] = controller[method].bind(controller);
    }
  });

  // Route mapping
  if (boundMethods.index) router.get(`/${name}`, boundMethods.index);
  if (boundMethods.new) router.get(`/${name}/new`, boundMethods.new);
  if (boundMethods.show) router.get(`/${name}/:id`, boundMethods.show);
  if (boundMethods.edit) router.get(`/${name}/edit/:id`, boundMethods.edit);
  if (boundMethods.create) router.post(`/${name}`, boundMethods.create);
  if (boundMethods.update) router.put(`/${name}/:id`, boundMethods.update);
  if (boundMethods.destroy) router.delete(`/${name}/:id`, boundMethods.destroy);
}
