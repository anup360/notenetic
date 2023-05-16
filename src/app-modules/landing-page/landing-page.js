import React, { useEffect, useState } from "react";
import "../../custom-css/landing-page.css"
import LandingHeader from "./header-landing-page";
import LandingFooter from "./footer_landing";

import CarouselLanding from "./carousel-landing";
const LandingPage = () => {
    return (
        <>
        <LandingHeader/>
        <div className="">
            <section className="banner_main">
                <div className="container">
                    <div className="banner_spacing">
                        <div className="row">
                            <div className="col-lg-6">
                                <h1 className="pt-5">
                                    Manage your Hospital with us.
                                </h1>
                                <p className="para-space">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Sed
                                    ut perspiciatis
                                    unde omnis iste natus error sit voluptatem</p>
                                <p className="mb-0 "><a href="" className="mr-1 app_btn text-decoration-none" type="btn">Join
                                    now</a><a href="" type="btn" className="ml-3 app_btn text-decoration-none">Learn more</a>
                                </p>
                                <div className="row years-main">
                                    <div className="col-lg-4">
                                        <h5 className="mb-0">20+</h5>
                                        <p className="f18-size count-width">Years of experience</p>
                                    </div>
                                    <div className="col-lg-4">
                                        <h5 className="mb-0">840+</h5>
                                        <p className="f18-size count-width">Hospitals Collaborated with us.</p>
                                    </div>
                                    <div className="col-lg-4">
                                        <h5 className="mb-0">98%</h5>
                                        <p className="f18-size count-width">Hospitals received assistance.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="banner-img text-right">
                                    <img src="/right_banner.png" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* banner-end  */}

            {/* What we offer start   */}
            <section className="main-offer-sec">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="offer-text">
                                <h3 className="h3-heading">What we offer</h3>
                                <p className="f20-size p_para ">Lorem Ipsum is simply dummy text of the printing and typesetting industry</p>
                            </div>
                        </div>
                    </div>
                    <div className="box_width py-4">
                    <div className="row">
                        <div className="col-lg-4 pt-4">
                            <div className="cards-set">
                                <img src="/box_offer3.png" alt="" />
                                <h5 className="pt-4 pb-3">Maintain Records</h5>
                                <p className="p_para">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusant
                                    doloremqe laudantium.
                                </p>
                                <a href="#" class="more_btn">More info<i className="fa fa-long-arrow-right pl-3 pt-1" aria-hidden="true"></i> </a>
                            </div>
                        </div>
                        <div className="col-lg-4 pt-4 pt-lg-0">
                            <div className="cards-set">
                                <img src="/box_offer2.png" alt="" />
                                <h5 className="pt-4 pb-3">Maintain Records</h5>
                                <p className="p_para">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusant
                                    doloremqe laudantium.
                                </p>
                                <a href="#"  class="more_btn">More info <i className="fa fa-long-arrow-right pl-3 pt-1" aria-hidden="true"></i> </a>
                            </div>
                        </div>
                        <div className="col-lg-4 pt-4">
                            <div className="cards-set">
                                <img src="/box_offer1.png" alt="" />
                                <h5 className="pt-4 pb-3">Maintain Records</h5>
                                <p className="p_para">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusant
                                    doloremqe laudantium.
                                </p>
                                <a href="#"  class="more_btn">More info <i className="fa fa-long-arrow-right pl-3 pt-1" aria-hidden="true"></i> </a>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div className="row pt-5">
                        <div className="col-lg-12">
                            <div className="text-center">
                                <a href="" type="btn" className="ml-2 app_btn text-decoration-none">All services</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* What we offer end   */}
            {/* Our Features start */}
            <section className=" Features-sec-main">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-5">
                            <h3 className="h3-heading pb-5 bg_text">Our Features</h3>
                            <p className="p_para">It is a long established fact that a reader will be distracted by the readable content of a page. Sed ut perspiciatis unde omnis iste natus error.</p>
                            <div>
                                <div className="list_features d-flex">
                                <ul className="list-styled-cus ">
                                    <li>Compatible to keep records</li>
                                    <li>Easy to manage staff</li>
                                    <li>Easy to manage patients</li>
                                </ul>
                                <ul className="list-styled-cus ml-3">
                                    <li>Unique technique</li>
                                    <li>Manage timetables</li>
                                </ul>
                                </div>
                                <p className="mb-0 pt-4"><a href="" className="mr-1 app_btn text-decoration-none" type="btn">Learn
                                    more</a>
                                </p>
                            </div>
                        </div>
                        <div className="col-md-7">
                            <div className="banner-img text-right ">
                                <img src="/right_features.png" alt="" class="position-relative" />
                                <div className="play_btn">
                                   <img src="/play.svg"></img>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Our Features end  */}


            {/* Pricing plans start  */}
            <section className="Pricing-sec-main">
                <div className="container">
                <div className="box_width py-4">
                    <div className="row">
                        <div className="col-12">
                            <div className="offer-text">
                                <h3 className="h3-heading">Pricing plans</h3>
                                <p className="p_para">Lorem Ipsum is simply dummy text of the printing and typesetting industry</p>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-4 pt-5 ">
                            <div className="cards-sec-set text-center">
                                <h5 className="">Monthly Plan</h5>
                                <h2 className="py-4 text-color-h2">$150</h2>
                                <ul className="list-styled-cus list_styled_month ">
                                    <li>Compatible to</li>
                                    <li>Compatible to</li>
                                    <li>Compatible to</li>
                                    <li>Compatible to</li>
                                    <li>Compatible to</li>
                                </ul>
                                <div className="mt-5">
                                    <a href="" type="btn" className="ml-2 app_btn ">Buy now </a>
                                </div>
                            </div>
                        </div> 
                        <div className="col-lg-4 pt-lg-0 pt-5">
                            <div className="cards-sec-set text-center">
                                <h5 className="">Yearly Plan</h5>
                                <h2 className="py-4 text-color-h2">$500</h2>
                                <ul className="list-styled-cus list_styled_month ">
                                    <li>Compatible to</li>
                                    <li>Compatible to</li>
                                    <li>Compatible to</li>
                                    <li>Compatible to</li>
                                    <li>Compatible to</li>
                                </ul>
                                <div className="mt-5">
                                    <a href="" type="btn" className="ml-2 app_btn ">Buy now </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 pt-5">
                            <div className="cards-sec-set text-center">
                                <h5 className="">Lifetime Plan</h5>
                                <h2 className="py-4 text-color-h2">$2,000</h2>
                                <ul className="list-styled-cus list_styled_month ">
                                    <li>Compatible to</li>
                                    <li>Compatible to</li>
                                    <li>Compatible to</li>
                                    <li>Compatible to</li>
                                    <li>Compatible to</li>
                                </ul>
                                <div className="mt-5">
                                    <a href="" type="btn" className="ml-2 app_btn ">Buy now </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Pricing plans end  */}


            {/* Our User start  */}
            {/* <section className="">
                <div className="container">
                    <div className="row pb-5">
                        <div className="col-12">
                            <div className="offer-text">
                                <h3 className="h3-heading">Our User</h3>
                                <p className="p_para">Lorem Ipsum is simply dummy text of the printing and typesetting industry</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="owl-set">
                            <div className="owl-carousel owl-theme">
                                <div className="item">

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section> */}
            {/* Our User end  */}
            {/* Our Blogs start   */}
            <section className="Our-Blogs-sec">
                <div className="container">
                    <div className="row pb-5">
                        <div className="col-6">
                            <h3 className="h3-heading">Our Blogs</h3>
                        </div>
                        <div className="col-6 ">
                            <div className="text-right pt-3">
                                <a href="#" type="btn" className="ml-2 app_btn">All services</a>
                            </div>
                        </div>
                    </div>
                    <div className="box_width py-4">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="cards-blogs-set">
                                <div className="blog-img">
                                    <img src="/blog_list1.png" alt="" className="w-100" />
                                </div>
                                <div className="blog-body">
                                    <div className="d-flex ">
                                        <p className="border-right pr-1">08 January 2021</p>
                                        <p className="border-right px-1">120 views </p>
                                        <p className="pl-1">No comments</p>
                                    </div>
                                    <h5>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed.</h5>
                                    <p className="py-2">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Sunt in similique culpa qui officia deserunt..
                                    </p>
                                    <a href="#" class="more_btn">Read more<i className="fa fa-long-arrow-right pl-3 pt-1" aria-hidden="true"></i> </a>
                                  
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 py-lg-0 py-4">
                            <div className="cards-blogs-set">
                                <div className="blog-img">
                                    <img src="/blog_list2.png" alt="" className="w-100" />
                                </div>
                                <div className="blog-body">
                                    <div className="d-flex ">
                                        <p className="border-right pr-1">08 January 2021</p>
                                        <p className="border-right px-1">120 views </p>
                                        <p className="pl-1">No comments</p>
                                    </div>
                                    <h5>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed.</h5>
                                    <p className="py-2">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Sunt in similique culpa qui officia deserunt.
                                    </p>
                                    <a href="#" class="more_btn">Read more<i className="fa fa-long-arrow-right pl-3 pt-1" aria-hidden="true"></i> </a>
                                
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="cards-blogs-set">
                                <div className="blog-img">
                                    <img src="/blog_list3.png" alt="" className="w-100" />
                                </div>
                                <div className="blog-body">
                                    <div className="d-flex ">
                                        <p className="border-right pr-1">08 January 2021</p>
                                        <p className="border-right px-1">120 views </p>
                                        <p className="pl-1">No comments</p>
                                    </div>
                                    <h5>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed.</h5>
                                    <p className="py-2">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Sunt in similique culpa qui officia deserunt..
                                    </p>
                                    <a href="#" class="more_btn">Read more<i className="fa fa-long-arrow-right pl-3 pt-1" aria-hidden="true"></i> </a>

                                </div>
                            </div>
                        </div>

                    </div>
                    </div>
                </div>
            </section>
            {/* What we offer end   */}

            {/* health start  */}
            <section className="health-sec">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="banner-img">
                                <img src="/accordian_right.png" alt="" className="w-100" />
                            </div>
                        </div>
                        <div className="col-md-6 mt-5">
                            <h3 className=" h3-heading">
                                The most popular questions to discuss mental health
                            </h3>
                            <div id="accordion" className="accordion">
                                <div className="card mb-0">
                                    <div className="border-bottom">
                                    <div className="card-header collapsed" data-toggle="collapse" href="#collapseOne">
                                        <a className="card-title">
                                            What is mental health?
                                        </a>
                                    </div>
                                    <div id="collapseOne" className="card-body collapse" data-parent="#accordion">
                                        <p>Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson
                                            ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food
                                            truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt
                                            aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et.
                                            Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente
                                            ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat
                                            craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't
                                            heard of them accusamus labore sustainable VHS.
                                        </p>
                                    </div>
                                    </div>
                                    <div className="border-bottom">
                                    <div className="card-header collapsed" data-toggle="collapse" data-parent="#accordion"
                                        href="#collapseTwo">
                                        <a className="card-title">
                                            Can you prevent mental health problems?
                                        </a>
                                    </div>
                                    <div id="collapseTwo" className="card-body collapse" data-parent="#accordion">
                                        <p>Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson
                                            ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food
                                            truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt
                                            aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et.
                                            Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente
                                            ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat
                                            craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't
                                            heard of them accusamus labore sustainable VHS.
                                        </p>
                                    </div>
                                    </div>
                                    <div className="border-bottom">
                                    <div className="card-header collapsed" data-toggle="collapse" data-parent="#accordion"
                                        href="#collapseThree">
                                        <a className="card-title">
                                            What are the 7 components of mental health?
                                        </a>
                                    </div>
                                    <div id="collapseThree" className="collapse" data-parent="#accordion">
                                        <div className="card-body">Anim pariatur cliche reprehenderit, enim eiusmod high life
                                            accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat
                                            skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf
                                            moon tempor, sunt
                                            aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et.
                                            samus labore sustainable VHS.
                                        </div>
                                    </div>
                                    </div>
                                    <div className="border-bottom">
                                    <div className="card-header collapsed" data-toggle="collapse" data-parent="#accordion"
                                        href="#collapsefour">
                                        <a className="card-title">
                                            What are the 7 components of mental health?
                                        </a>
                                    </div>
                                    <div id="collapsefour" className="collapse" data-parent="#accordion">
                                        <div className="card-body">Anim pariatur cliche reprehenderit, enim eiusmod high life
                                            accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat
                                            skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf
                                            moon tempor, sunt
                                            aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et.
                                            samus labore sustainable VHS.
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* end  */}
            {/* {<CarouselLanding/>} */}
            <LandingFooter />
         </div>
  
           
        </>

    )

}
export default LandingPage;
