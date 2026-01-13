self.addEventListener("push", (event) => {
    const data = event.data?.json() || {};
    self.registration.showNotification(data.title || "News26", {
        body: data.body || "Breaking news update",
    });
});
