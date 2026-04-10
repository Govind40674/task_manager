import React, { Suspense, lazy } from "react";
import styles from "./Route.module.css";
import { Routes, Route } from "react-router-dom";

// Lazy loaded components
const Home = lazy(() => import("../../pages/home/Home"));
const NotFound = lazy(() => import("../../pages/error/Not_found"));


function AppRoutes() {
  return (
    <div className={styles.routeContainer}>
      <Suspense
        fallback={
          <div className={styles.loadingContainer}>
            <div className={styles.loader}></div>
            <p className={styles.loadingText}>Loading Page...</p>
          </div>
        }
      >
        <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="*" element={<NotFound />} />


        

          
        </Routes>
      </Suspense>
    </div>
  );
}

export default AppRoutes;








// function AppRoutes() {
//   return (
//    <Suspense fallback={
//   <div className={styles.container}>
//     <h2 style={{ color: "white" }}>Loading...</h2>
//   </div>
// }>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </Suspense>
//   );
// }

// export default AppRoutes;