const rules =require("./rbac-rules.js");

const check = ( role, action, data) => {
  const permissions = rules[role];
  if (!permissions) {
    // role is not present in the rules
    return false;
  }

  const staticPermissions = permissions.static;

  if (staticPermissions && staticPermissions.includes(action)) {
    // static rule not provided for action
    return true;
  }

  const dynamicPermissions = permissions.dynamic;

  if (dynamicPermissions) {
    const permissionCondition = dynamicPermissions[action];
    if (!permissionCondition) {
      // dynamic rule not provided for action
      return false;
    }

    return permissionCondition(data);
  }
  return false;
};

const CanComponent = props =>
  check( props.role, props.perform, props.data)
    ? props.yes()
    : props.no();

CanComponent.defaultProps = {
  yes: () => null,
  no: () => null
};

module.exports = check;