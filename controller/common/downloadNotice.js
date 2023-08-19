const path = require("path");

const handleDownloadNotice = (req, res) => {
  const filePath = path.join(__dirname, "../../public/notice.pdf");
  const filename = `notice ${new Date().toLocaleDateString()}.pdf`;
  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
  res.setHeader("Content-Type", "application/pdf");
  res.sendFile(filePath);
};

module.exports = {
  handleDownloadNotice,
};
