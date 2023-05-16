function Footer() {
 return (
    <div>
 
 <footer className='footer-main'>
 <div className="container">

     <h1 className="logo-link notenetic-text text-center pb_20">Notenetic</h1>
     <div className="row ptb_40">
        <div className='col-lg-3 col-md-4 col-12'>
         <h4 className='address-title text-grey mb-2'><span className='f-24'>Contact info</span></h4>
         <p className='f-16 text-grey'>If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing</p>
        </div>
        {/*End*/}
        <div className='col-lg-5 col-md-6 col-12'>
       <div className='d-flex flex-wrap pt_30'>
         <div className='address-column d-flex align-items-center col-md-6 col-12 mb-3'>
            <span className="fa fa-phone circle-rouned"></span>
         <div className='content-footer pl-2'>
             <p className='mb-0 f-14'>Phone number</p>
             <p className='fw-bold mb-0 f-16'>+1 234 56 78 123</p>
         </div>
         </div>
         {/*End*/}
         <div className='address-column d-flex align-items-center col-md-6 col-12 mb-3'>
            <span className="k-icon k-i-email circle-rouned"></span>
         <div className='content-footer pl-2'>
             <p className='mb-0 f-14'>Email</p>
             <p className='fw-bold mb-0 f-16'>info@notenetic.com</p>
         </div>
         </div>
         {/*End*/}
         <div className='address-column d-flex align-items-center col-md-6 col-12  mb-3'>
            <span className="fa fa-fax circle-rouned"></span>
         <div className='content-footer pl-2'>
             <p className='mb-0 f-14'>Fax</p>
             <p className='fw-bold mb-0 f-16'>+1 234 56 78 123</p>
         </div>
         </div>
         {/*End*/}
         <div className='address-column d-flex align-items-center col-md-6 col-12 mb-3'>
            <span className="k-icon k-i-marker-pin circle-rouned"></span>
         <div className='content-footer pl-2'>
             <p className='mb-0 f-14'>Location</p>
             <p className='fw-bold mb-0 f-16'>49, Caradon Hill, ULBSTER</p>
         </div>
         </div>
         {/*End*/}
       </div>
        </div>
        {/*End*/}
        <div className='col-lg-2 col-md-6 col-12'>
         <h5 className='address-title text-grey pt_30 mb-2'><span className='f-18'>Quick Access</span></h5>
          <ul className='list-unstyled'>
             <li className='mb-2'><a href='' className="text-grey f-16 text-decoration-none">Home</a></li>
             <li className='mb-2'><a href='' className="text-grey f-16 text-decoration-none">About</a></li>
             <li className='mb-2'><a href='' className="text-grey f-16 text-decoration-none">Contact us</a></li>
             <li className='mb-2'><a href='' className="text-grey f-16 text-decoration-none">Blogs</a></li>
             <li className='mb-2'><a href='' className="text-grey f-16 text-decoration-none">Join us</a></li>
          </ul>
        </div>
        {/*End*/}
        <div className='col-lg-2 col-md-6 col-12'>
         <h5 className='address-title text-grey pt_30 mb-2'><span className='f-18'>Social Accounts</span></h5>
          <ul className='list-unstyled social-icons'>
             <li className='mb-2'><a href='' className="text-grey f-16 text-decoration-none"><span className="k-icon k-i-facebook text-black"></span></a></li>
             <li className='mb-2'><a href='' className="text-grey f-16 text-decoration-none"><span className='k-icon k-i-twitter text-black'></span></a></li>
             <li className='mb-2'><a href='' className="text-grey f-16 text-decoration-none"><span className="k-icon k-i-google text-black"></span></a></li>
             <li className='mb-2'><a href='' className="text-grey f-16 text-decoration-none"><span className="k-icon k-i-linkedin text-black"></span> </a></li>
             <li className='mb-2'><a href='' className="text-grey f-16 text-decoration-none"><span className="k-icon k-i-instagram text-black"></span></a></li>
          </ul>
        </div>
        {/*End*/}
     </div>
     <div className='border-bottom'></div>
     <div className='ptb_30'>
         <p className='text-center f-16 text-grey mb-0'>Notenetic All rights reserved Copyrights 2022</p>
     </div>
 </div>
</footer>
</div>
);
 }
 export default Footer;
