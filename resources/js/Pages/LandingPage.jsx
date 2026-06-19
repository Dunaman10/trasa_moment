import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Hero from "../Components/Hero";
import FuzzyWidget from "../Components/FuzzyWidget";
import Services from "../Components/Services";
import HowItWorks from "../Components/HowItWorks";
import Portfolio from "../Components/Portfolio";
import Testimonials from "../Components/Testimonials";
import Footer from "../Components/Footer";
import CalendarPage from "./CalendarPage";
import CheckoutPage from "./CheckoutPage";
import TrackingPage from "./TrackingPage";

export default function LandingPage() {
    const [page, setPage] = useState(() => localStorage.getItem("current_page") || "landing");
    const [selectedPackage, setSelectedPackage] = useState(() => {
        try {
            const saved = localStorage.getItem("selected_package");
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    });
    const [bookingDate, setBookingDate] = useState(() => localStorage.getItem("booking_date") || "");
    const [bookingTimeSlot, setBookingTimeSlot] = useState(() => localStorage.getItem("booking_time_slot") || "");
    const [bookingCode, setBookingCode] = useState("");
    const [justCheckedOut, setJustCheckedOut] = useState(false);
    const [landingData, setLandingData] = useState(null);

    useEffect(() => {
        localStorage.setItem("current_page", page);
    }, [page]);

    useEffect(() => {
        if (selectedPackage) {
            localStorage.setItem("selected_package", JSON.stringify(selectedPackage));
        } else {
            localStorage.removeItem("selected_package");
        }
    }, [selectedPackage]);

    useEffect(() => {
        localStorage.setItem("booking_date", bookingDate);
    }, [bookingDate]);

    useEffect(() => {
        localStorage.setItem("booking_time_slot", bookingTimeSlot);
    }, [bookingTimeSlot]);

    useEffect(() => {
        fetch("/api/landing-data")
            .then(res => res.json())
            .then(data => {
                setLandingData(data);
            })
            .catch(err => {
                console.error("Failed to load landing data", err);
            });
    }, []);

    const handleNavigate = (targetPage, sectionId) => {
        setJustCheckedOut(false);
        setPage(targetPage);
        if (sectionId) {
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }, 100);
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleSelectPackage = (pkg, pkgPrice, pkgDesc) => {
        if (pkg && typeof pkg === "object") {
            setSelectedPackage(pkg);
        } else {
            setSelectedPackage({ name: pkg, price: pkgPrice, desc: pkgDesc });
        }
        setPage("calendar");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleProceedToCheckout = (pkg, dateStr, timeSlotId) => {
        setSelectedPackage(pkg);
        setBookingDate(dateStr);
        setBookingTimeSlot(timeSlotId);
        setPage("checkout");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCheckoutSuccess = (newBookingCode) => {
        setBookingCode(newBookingCode);
        setJustCheckedOut(true);
        setPage("tracking");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-white font-sans antialiased text-slate-800 selection:bg-brand-primary/20 selection:text-brand-deep">
            {/* Header / Navbar */}
            <Navbar onNavigate={handleNavigate} currentPage={page} />

            {/* Main content elements */}
            <main>
                {page === "landing" && (
                    <>
                        {/* Hero Section */}
                        <Hero />

                        {/* Fuzzy Recommendation Tool Section */}
                        <FuzzyWidget onSelectPackage={handleSelectPackage} />

                        {/* Services comparison Grid */}
                        <Services onSelectPackage={handleSelectPackage} packages={landingData?.packages} />

                        {/* How it works details */}
                        <HowItWorks />

                        {/* Gallery of photos */}
                        <Portfolio items={landingData?.portfolios} />

                        {/* Feedback & reviews */}
                        <Testimonials testimonials={landingData?.testimonials} />
                    </>
                )}

                {page === "calendar" && (
                    <CalendarPage
                        selectedPackage={selectedPackage}
                        packages={landingData?.packages}
                        onBack={() => handleNavigate("landing")}
                        onProceed={handleProceedToCheckout}
                    />
                )}

                {page === "checkout" && (
                    <CheckoutPage
                        selectedPackage={selectedPackage}
                        bookingDate={bookingDate}
                        bookingTimeSlot={bookingTimeSlot}
                        onBack={() => handleNavigate("calendar")}
                        onSuccess={handleCheckoutSuccess}
                    />
                )}

                {page === "tracking" && (
                    <TrackingPage
                        initialBookingCode={bookingCode}
                        justCheckedOut={justCheckedOut}
                        onBackToLanding={() => {
                            setJustCheckedOut(false);
                            handleNavigate("landing");
                        }}
                    />
                )}
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
