db = db.getSiblingDB('Url');
db.createUser({
  user: "myuser",
  pwd: "mypassword",
  roles: [{ role: "readWrite", db: "Url" }]
});