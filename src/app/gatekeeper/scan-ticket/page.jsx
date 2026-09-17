"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, QrCode, Send } from "lucide-react";
import useAxios from "@/hooks/useAxios";
import { showToast } from "@/components/_ui/toast-utils";
import TicketModal from "@/components/_dialogs/TicketModal";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function TicketScanner() {
  const [scannedCode, setScannedCode] = useState(null);
  const [manualCode, setManualCode] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [responseData, setResponseData] = useState(null);

  const [loading, setLoading] = useState(false);
  const scannerRef = useRef(null);
  const videoRef = useRef(null);
  const { request: checkTicket } = useAxios();

  // mount
  useEffect(() => {
    startScanner();
    return () => stopScanner();
  }, []);

  const startScanner = async () => {
    // ✅ Try BarcodeDetector first
    if ("BarcodeDetector" in window) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        const detector = new window.BarcodeDetector({ formats: ["qr_code"] });

        const detectLoop = async () => {
          if (!videoRef.current) return;
          try {
            const barcodes = await detector.detect(videoRef.current);
            if (barcodes.length > 0 && !loading) {
              const qrValue = barcodes[0].rawValue;
              stopScanner();
              try {
                const parsed = JSON.parse(qrValue);
                setScannedCode(parsed);
                await handleSubmit(parsed);
              } catch {
                setScannedCode({ ticketId: qrValue });
                await handleSubmit({ ticketId: qrValue });
              }
              return;
            }
          } catch {}
          requestAnimationFrame(detectLoop);
        };
        requestAnimationFrame(detectLoop);
        return;
      } catch (err) {
        console.warn("BarcodeDetector failed, falling back:", err);
      }
    }

    // ❌ Fallback → html5-qrcode
    try {
      const html5QrCode = new Html5Qrcode("reader");
      scannerRef.current = html5QrCode;
      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 15,
          videoConstraints: {
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        },
        async (decodedText) => {
          if (!loading) {
            stopScanner();
            try {
              const parsed = JSON.parse(decodedText);
              setScannedCode(parsed);
              await handleSubmit(parsed);
            } catch {
              setScannedCode({ ticketId: decodedText });
              await handleSubmit({ ticketId: decodedText });
            }
          }
        }
      );
    } catch (err) {
      console.error("Scanner init failed:", err);
      showToast("error", "Failed to start scanner");
    }
  };

  const stopScanner = async () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch {}
      scannerRef.current = null;
    }
  };

  // const handleSubmit = async (scanCode = {}) => {
  //   const code =
  //     scanCode.ticketId || scannedCode?.ticketId || manualCode?.trim();

  //   if (!code) {
  //     showToast("error", "Please scan or enter a ticket code!");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     const { data, error } = await checkTicket({
  //       method: "POST",
  //       url: "/gatekeeper/check-ticket",
  //       authRequired: true,
  //       payload: { ticketId: code },
  //     });

  //     if (data?.status === 200) {
  //       showToast("success", data?.message || "Ticket verified!");
  //       setScannedCode(null);
  //       setManualCode("");
  //     } else {
  //       showToast("error", error || "Ticket verification failed!");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     showToast("error", "Error verifying ticket");
  //   } finally {
  //     setLoading(false);
  //     startScanner();
  //   }
  // };

const handleSubmit = async (scanCode = {}) => {
  const code =
    scanCode.ticketId || scannedCode?.ticketId || manualCode?.trim();

  if (!code) {
    showToast("error", "Please scan or enter a ticket code!");
    return;
  }

  try {
    setLoading(true);

    const { data, error } = await checkTicket({
      method: "POST",
      url: "/gatekeeper/check-ticket",
      authRequired: true,
      payload: { ticketId: code },
    });

    console.log(data,"data from check ticket");
    console.log(error,"error from check ticket");
    // ✅ API hamesha response deta hai (success/error dono case me)
   
      setResponseData({
      success: data?.success ?? false, // agar 400 me undefined ho to false
      message: data?.message ?? error ?? "Something went wrong",
      data: data?.data ?? null,
    });
    

    // setResponseData({
    //   success: data?.success,
    //   message: data?.message,
    //   data: data?.data || null,
    // });

    setModalOpen(true);

    // scanner state reset kar
    setScannedCode(null);
    setManualCode("");
  } catch (err) {
    console.error(err,"---------------------------");

    // ✅ agar API hi crash ho gayi to fallback modal dikhana
    setResponseData({
      success: false,
      message: err.message,
      data: null,
    });
    setModalOpen(true);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex justify-center items-center w-full h-full p-4 bg-gray-50">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <QrCode className="w-6 h-6" /> Ticket Scanner
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* QR Scanner */}
          <div className="w-full aspect-square bg-black/5 rounded-xl overflow-hidden relative flex items-center justify-center">
            {/* BarcodeDetector video */}
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              muted
              playsInline
            />
            {/* html5-qrcode fallback container */}
            <div id="reader" className="absolute inset-0 w-full h-full" />
          </div>

          {/* Scanned result */}
          {scannedCode && (
            <div className="text-green-600 font-medium text-center space-y-1">
              <p>✅ Ticket ID: {scannedCode.ticketId}</p>
            </div>
          )}

          {/* Manual Entry */}
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Or enter ticket code manually:
            </p>
            <Input
              placeholder="Enter ticket code"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
            />
          </div>

          {/* Submit */}
          <Button
            onClick={() => handleSubmit()}
            className="w-full flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Submit Ticket
              </>
            )}
          </Button>

          {/* Restart */}
          <Button
            variant="secondary"
            onClick={startScanner}
            className="w-full flex items-center justify-center gap-2"
            disabled={loading}
          >
            Restart Scanner
          </Button>
        </CardContent>
      </Card>

      
         <TicketModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        responseData={responseData}
        setResponseData={setResponseData}
        startScanner={startScanner}
      />
    </div>
  );
}
