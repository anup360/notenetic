import React from "react";

const LandingFooter = () => {
    return (
        <footer className="footer_main">

            <div className="row">
                <div className="col-lg-6">
                    <div className="contact_footer">
                        <h4>Contact info</h4>
                        <p> If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing</p>
                    </div>
                    <div className="row mt-3">
                        <div className="col-lg-6">
                            <div className='address-column d-flex align-items-center mb-3'>
                                <span className="fa fa-phone circle-rouned"></span>
                                <div className='content-footer pl-2'>
                                    <p className='mb-0 f-14'>Phone number</p>
                                    <p className='fw-bold mb-0 f-16'>+1 234 56 78 123</p>
                                </div>
                            </div>
                            {/*End*/}
                            <div className='address-column d-flex align-items-center mb-3'>
                                <span className="k-icon k-i-email circle-rouned"></span>
                                <div className='content-footer pl-2'>
                                    <p className='mb-0 f-14'>Email</p>
                                    <p className='fw-bold mb-0 f-16'>info@notenetic.com</p>
                                </div>

                                {/*End*/}

                                {/*End*/}
                            </div>

                        </div>
                        <div className="col-lg-6">
                            <div className='address-column d-flex align-items-center  mb-3'>
                                <span className="fa fa-fax circle-rouned"></span>
                                <div className='content-footer pl-2'>
                                    <p className='mb-0 f-14'>Fax</p>
                                    <p className='fw-bold mb-0 f-16'>+1 234 56 78 123</p>
                                </div>
                            </div>
                            {/*End*/}
                            <div className='address-column d-flex align-items-center  mb-3'>
                                <span className="k-icon k-i-marker-pin circle-rouned"></span>
                                <div className='content-footer pl-2'>
                                    <p className='mb-0 f-14'>Location</p>
                                    <p className='fw-bold mb-0 f-16'>49, Caradon Hill, ULBSTER</p>
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-6 col-12'>
         <h5 className='address-title text-grey pt_30 mb-2'><span className='f-18'>Quick Access</span></h5>
          <ul className='list-unstyled'>
             <li className='mb-2'><a href='' className="text-grey f-16 text-decoration-none">Home</a></li>
             <li className='mb-2'><a href='' className="text-grey f-16 text-decoration-none">About</a></li>
             <li className='mb-2'><a href='' className="text-grey f-16 text-decoration-none">Contact us</a></li>
             <li className='mb-2'><a href='' className="text-grey f-16 text-decoration-none">Blogs</a></li>
             <li className='mb-2'><a href='' className="text-grey f-16 text-decoration-none">Join us</a></li>
          </ul>
        </div>
        <div className='col-lg-6  col-12'>
         <h5 className='address-title text-grey pt_30 mb-2'><span className='f-18'>Social Accounts</span></h5>
          <ul className='list-unstyled social-icons'>
             <li className='mb-2'><a href='' className="text-grey f-16 text-decoration-none"><span className="k-icon k-i-facebook text-black"></span></a></li>
             <li className='mb-2'><a href='' className="text-grey f-16 text-decoration-none"><span className='k-icon k-i-twitter text-black'></span></a></li>
             <li className='mb-2'><a href='' className="text-grey f-16 text-decoration-none"><span className="k-icon k-i-google text-black"></span></a></li>
             <li className='mb-2'><a href='' className="text-grey f-16 text-decoration-none"><span className="k-icon k-i-linkedin text-black"></span> </a></li>
             <li className='mb-2'><a href='' className="text-grey f-16 text-decoration-none"><span className="k-icon k-i-instagram text-black"></span></a></li>
          </ul>
        </div>
                    </div>
                </div>
                <div className="col-lg-6">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27456.98129969094!2d76.80378908617828!3d30.658674242664972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390feb365ab1fd83%3A0x4bd8ef389a18e7cc!2sZirakpur%2C%20Punjab!5e0!3m2!1sen!2sin!4v1683273344181!5m2!1sen!2sin"
                    style={{ width: "1500", height: "700", border: "0", allowfullscreen: "", loading: "lazy", referrerpolicy: "no-referrer-when-downgrade" }}
                ></iframe>
                </div>
            </div>

        </footer>
    )
}

export default LandingFooter