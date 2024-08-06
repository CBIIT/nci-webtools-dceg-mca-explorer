export function logRequests(formatter = (request) => [request.path, { ...request.query, ...request.body }]) {
  return (request, response, next) => {
    const { logger } = request.app.locals;
    logger.info(formatter(request));
    next();
  };
}

export function logErrors(formatter = (error) => (error.stack ? error.stack : error)) {
  return (error, request, response, next) => {
    const { logger } = request.app.locals;
    logger.error(formatter(error));
    response.status(500).json(`${error.name}: ${error.message}`);
  };
}
