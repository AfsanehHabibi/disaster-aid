const rules = {
  ControlCenterAgent: {
    static: [
      "create:form-descriptor",
      "read:area",
      "read:form-descriptor",
      "read:form-filled",
      "dashboard-page:visit"
    ]
  },
  FieldAgent: {
    static: [
      "create:form-filled",
      "read:area",
      "read:form-descriptor",
      "dashboard-page:visit"
    ],
    dynamic: {
      "update:form-filled": ({ userId, formOwnerId }) => {
        if (!userId || !formOwnerId) return false;
        return userId === formOwnerId;
      }
    }
  },
  Admin: {
    static: [
      "create:area",
      "create:form-descriptor",
      "create:form-filled",
      "delete:area",
      "delete:form-descriptor",
      "delete:form-filled",
      "read:area",
      "read:form-descriptor",
      "read:form-filled",
      "dashboard-page:visit"
    ]
  }
};

module.exports = rules;