// Assuming you have an API endpoint to fetch pending approvals
const apiUrl = "https://your-api.com/pending-approvals";

// Function to fetch pending approvals and render them on the portal startup page
function renderPendingApprovals() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const pendingApprovalsContainer = document.getElementById(
        "pending-approvals-container"
      );

      data.forEach((approval) => {
        // Create and append elements to display each pending approval
        const approvalElement = document.createElement("div");
        approvalElement.textContent = `Change Request ${approval.changeRequestId} requires approval`;
        pendingApprovalsContainer.appendChild(approvalElement);
      });
    })
    .catch((error) => {
      console.error("Error fetching pending approvals:", error);
    });
}

// Change request widget function
function createChangeRequestWidget() {
  let changeRequestId = null;
  let changeRequestStatus = null;

  function createChangeRequest(customerId, changeDetails) {
    // Step 1: Send a request to the server to create a Change request
    // Include customerId and changeDetails in the request payload
    // Upon successful creation, store the changeRequestId

    // Example implementation:
    fetch("/create-change-request", {
      method: "POST",
      body: JSON.stringify({ customerId, changeDetails }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        changeRequestId = data.changeRequestId;
      })
      .catch((error) => {
        console.error("Error creating Change request:", error);
      });
  }

  function getChangeRequestStatus() {
    // Step 2: Send a request to the server to get the status of the Change request
    // Use the changeRequestId to retrieve the status
    // Store the status in the changeRequestStatus variable

    // Example implementation:
    fetch(`/get-change-request-status?changeRequestId=${changeRequestId}`)
      .then((response) => response.json())
      .then((data) => {
        changeRequestStatus = data.status;
      })
      .catch((error) => {
        console.error("Error getting Change request status:", error);
      });
  }

  function handleAccept() {
    // Step 8: Action to be performed when the user accepts the change request
    // Example actions:
    //  - Assign the Change request to the correct resolver group (e.g., Networks team)
    //  - Display a success message to the user

    // Example implementation:
    fetch(
      `/assign-to-resolver-group?changeRequestId=${changeRequestId}&group=Networks`
    )
      .then(() => {
        displaySuccessMessage("Change request accepted successfully");
      })
      .catch((error) => {
        console.error(
          "Error assigning Change request to resolver group:",
          error
        );
      });
  }

  function handleDecline() {
    // Step 8: Action to be performed when the user declines the change request
    // Example actions:
    //  - Close the Change request
    //  - Display a message to the user indicating the request has been closed

    // Example implementation:
    fetch(`/close-change-request?changeRequestId=${changeRequestId}`)
      .then(() => {
        displayMessage("Change request declined. Request closed.");
      })
      .catch((error) => {
        console.error("Error closing Change request:", error);
      });
  }

  function renderWidget() {
    // Step 9: Render the widget on the customer portal page
    // This can be a simple HTML element or a modal overlay
    // Display the changeRequestStatus and provide options for accepting or declining the change request
    // Attach event listeners to the accept and decline buttons

    const widgetContainer = document.getElementById("change-request-widget");

    // Display the changeRequestStatus
    const statusElement = document.createElement("p");
    statusElement.textContent = `Change Request Status: ${changeRequestStatus}`;
    widgetContainer.appendChild(statusElement);

    // Accept button
    const acceptButton = document.createElement("button");
    acceptButton.textContent = "Accept";
    acceptButton.addEventListener("click", handleAccept);
    widgetContainer.appendChild(acceptButton);

    // Decline button
    const declineButton = document.createElement("button");
    declineButton.textContent = "Decline";
    declineButton.addEventListener("click", handleDecline);
    widgetContainer.appendChild(declineButton);
  }

  return {
    createChangeRequest,
    getChangeRequestStatus,
    renderWidget,
  };
}

const changeRequestWidget = createChangeRequestWidget();

// Usage example:
// Assuming you have a form with customer input and a submit button
const customerIdInput = document.getElementById("customer-id");
const changeDetailsInput = document.getElementById("change-details");
const submitButton = document.getElementById("submit-button");

submitButton.addEventListener("click", () => {
  const customerId = customerIdInput.value;
  const changeDetails = changeDetailsInput.value;

  changeRequestWidget.createChangeRequest(customerId, changeDetails);
});

// After the Change request is created, you can call the following functions to retrieve the status and render the widget
changeRequestWidget.getChangeRequestStatus();
changeRequestWidget.renderWidget();

// Call renderPendingApprovals on page load or as needed
renderPendingApprovals();
