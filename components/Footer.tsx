import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">CUMall</h3>
            <p className="text-primary-foreground/80">
              Your one-stop shop for all campus needs. From stationery to dorm essentials, we've got everything to make
              your campus life easier.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-secondary transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="hover:text-secondary transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="hover:text-secondary transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-secondary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-secondary transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-secondary transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-secondary transition-colors">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-secondary transition-colors">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categories/Stationery" className="hover:text-secondary transition-colors">
                  All Stationeries
                </Link>
              </li>
              <li>
                <Link href="/categories/Personal Care" className="hover:text-secondary transition-colors">
                  Personal Care
                </Link>
              </li>
              <li>
                <Link href="/categories/Dorm Essentials" className="hover:text-secondary transition-colors">
                  Dorm Essentials
                </Link>
              </li>
              <li>
                <Link href="/categories/Sports & Fitness" className="hover:text-secondary transition-colors">
                  Sports & Fitness
                </Link>
              </li>
              <li>
                <Link href="/categories/Electronics" className="hover:text-secondary transition-colors">
                  Electronics
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 shrink-0 mt-0.5" />
                <span>Covenant University, Below Chapel</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5" />
                <span>+123 456 7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                <span>info@cumall.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-primary-foreground/70">
          <p>© {new Date().getFullYear()} CUMall. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
