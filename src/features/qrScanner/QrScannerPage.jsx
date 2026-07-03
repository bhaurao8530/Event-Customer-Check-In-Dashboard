import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { checkInApi, qrVerificationApi } from "../../api/mockApi";
import { toast } from "react-toastify";

const scannerConfig = {
  fps: 10,
  qrbox: { width: 240, height: 240 },
  aspectRatio: 1.0,
};

function QrScannerPage() {
  const [qrCode, setQrCode] = useState("");
  const [verifiedCustomer, setVerifiedCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cameraStatus, setCameraStatus] = useState("idle");
  const [scannerMessage, setScannerMessage] = useState("Start the camera to scan a QR code.");
  const scannerRef = useRef(null);

  useEffect(() => {
    scannerRef.current = new Html5Qrcode("qr-reader");

    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.stop().catch(() => {});
        } catch {
          // Ignore errors during cleanup
        }
      }
    };
  }, []);

  const stopScanner = async () => {
    if (!scannerRef.current) return;
    try {
      await scannerRef.current.stop();
    } catch {
      // Ignore if scanner is already stopped
    }
  };

  const handleStartScanner = async () => {
    if (!scannerRef.current) return;

    try {
      setLoading(true);
      setError("");
      setCameraStatus("starting");
      setScannerMessage("Requesting camera access...");

      await scannerRef.current.start(
        { facingMode: "environment" },
        scannerConfig,
        async (decodedText) => {
          setQrCode(decodedText);
          await stopScanner();
          setCameraStatus("idle");
          setScannerMessage("QR detected. Verifying customer...");
          await handleVerify(decodedText);
        },
        () => {},
      );

      setCameraStatus("active");
      setScannerMessage("Camera is ready. Point it at a QR code.");
    } catch (err) {
      setCameraStatus("permission-needed");
      setScannerMessage("Camera permission is required to scan QR codes.");
      setError(err?.message || "Unable to access camera.");
      toast.error(err?.message || "Unable to access camera");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (value = qrCode) => {
    if (!value) return;

    try {
      setLoading(true);
      setError("");
      const response = await qrVerificationApi(value);
      setVerifiedCustomer(response.data.customer);
      toast.success("Customer verified");
    } catch (err) {
      setVerifiedCustomer(null);
      setError(err.message || "Verification failed");
      toast.error(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!verifiedCustomer) return;

    try {
      setLoading(true);
      await checkInApi(verifiedCustomer.id);
      toast.success("Customer checked in");
      setVerifiedCustomer({ ...verifiedCustomer, eventStatus: "Checked-In", qrUsed: true });
    } catch (err) {
      toast.error(err.message || "Check-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-card">
      <div className="section-header">
        <div>
          <p className="eyebrow">QR verification</p>
          <h1>QR Scan & Check-In</h1>
        </div>
      </div>

      <div className="grid-layout">
        <div className="card-panel qr-panel">
          <div className="qr-scan-header">
            <div>
              <h3>Scan a QR code</h3>
              <p>{scannerMessage}</p>
            </div>
            <button className="primary-btn" onClick={handleStartScanner} disabled={loading}>
              {cameraStatus === "active" ? "Restart Camera" : "Start Camera"}
            </button>
          </div>

          {cameraStatus === "permission-needed" ? (
            <div className="camera-permission-card">
              <strong>Camera access is required</strong>
              <p>Please allow camera permission to scan QR codes quickly.</p>
              <button className="primary-btn" onClick={handleStartScanner}>
                Try Again
              </button>
            </div>
          ) : null}

          <div id="qr-reader" className="qr-reader" />

          <div className="qr-actions">
            <input className="field" placeholder="Or enter QR manually" value={qrCode} onChange={(event) => setQrCode(event.target.value)} />
            <button className="primary-btn" onClick={() => handleVerify(qrCode)}>
              Verify
            </button>
          </div>
        </div>

        <div className="card-panel">
          <h3>Customer details</h3>
          {loading ? <p>Processing…</p> : null}
          {error ? <p className="error-text">{error}</p> : null}
          {verifiedCustomer ? (
            <div className="detail-stack">
              <p><strong>Name:</strong> {verifiedCustomer.name}</p>
              <p><strong>Mobile:</strong> {verifiedCustomer.mobile}</p>
              <p><strong>Email:</strong> {verifiedCustomer.email}</p>
              <p><strong>Project:</strong> {verifiedCustomer.projectName}</p>
              <p><strong>Status:</strong> {verifiedCustomer.eventStatus}</p>
              <p><strong>QR Code:</strong> {verifiedCustomer.qrCode}</p>
              <button className="primary-btn" onClick={handleCheckIn}>
                Check In Customer
              </button>
            </div>
          ) : (
            <p>Scan or enter a QR code to see attendee details.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default QrScannerPage;
