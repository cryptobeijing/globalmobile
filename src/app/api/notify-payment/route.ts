import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/utils/mailer";
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { shareId, selectedItems, total, payerName } = body;

    // Validate required fields
    if (!shareId || !selectedItems || !total) {
      return NextResponse.json(
        {
          error: "Missing required fields: shareId, selectedItems, and total are required",
        },
        { status: 400 }
      );
    }

    // Fetch the crossborderdata from the database
    const { data: crossborderdata, error } = await supabase
      .from('crossborderdata')
      .select('*')
      .eq('share_id', shareId)
      .single();

    if (error || !crossborderdata) {
      return NextResponse.json(
        { error: "Crossborderdata not found" },
        { status: 404 }
      );
    }

    console.log('Fetched crossborderdata data:', crossborderdata);
    console.log('Current paid_items in database:', crossborderdata.paid_items);

    // Check if crossborderdata creator has an email
    if (!crossborderdata.user_email) {
      return NextResponse.json(
        { error: "Crossborderdata creator has no email address" },
        { status: 400 }
      );
    }

    // Get the selected items details
    const items = crossborderdata.items as any[];
    const purchasedItems = items.filter(item => selectedItems.includes(item.id));

    // Format the items list for email
    const itemsList = purchasedItems.map(item => 
      `<li><strong>${item.name}</strong> - $${item.price.toFixed(2)}</li>`
    ).join('');

    // Get shipping address
    let shippingAddress = "Address not provided";
    if (crossborderdata.user_address) {
      try {
        console.log('Raw address data:', crossborderdata.user_address);
        
        // Try to parse as JSON first (in case it's stored as JSON)
        let address;
        try {
          address = JSON.parse(crossborderdata.user_address);
          console.log('Parsed as JSON:', address);
          
          // If it's a JSON object with address fields
          if (typeof address === 'object' && address !== null) {
            const addressParts = [
              address.streetAddress || address.address1,
              address.city,
              address.region || address.state,
              address.postalCode,
              address.country || address.countryCode
            ].filter(part => part && part.trim() !== '');
            
            if (addressParts.length > 0) {
              shippingAddress = addressParts.join(', ');
            } else {
              shippingAddress = "Address provided but details are incomplete";
            }
          } else {
            // If it's not an object, treat it as a string
            shippingAddress = address || "Address format error";
          }
        } catch (jsonError) {
          // If JSON parsing fails, treat it as a plain string
          console.log('Not JSON, treating as string');
          shippingAddress = crossborderdata.user_address;
        }
        
        console.log('Final shipping address:', shippingAddress);
      } catch (e) {
        console.error('Error processing address:', e);
        shippingAddress = "Address format error";
      }
    } else {
      console.log('No user_address found in crossborderdata');
    }

    const emailSubject = "🎉 Someone Just Paid for Your Crossborderdata Items!";
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h1 style="color: #6366f1; text-align: center; margin-bottom: 30px;">🎁 Gift Payment Received!</h1>
          
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            Hello ${crossborderdata.user_name || 'there'},
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            Great news! Someone has just paid for items from your crossborderdata. Your gifts are on their way!
          </p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">📦 Purchased Items:</h3>
            <ul style="color: #374151; line-height: 1.6;">
              ${itemsList}
            </ul>
            <div style="border-top: 1px solid #d1d5db; padding-top: 15px; margin-top: 15px;">
              <strong style="color: #1f2937; font-size: 18px;">Total Paid: $${total.toFixed(2)} USDC</strong>
            </div>
          </div>
          
          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <h3 style="color: #1e40af; margin-top: 0;">🚚 Shipping Information:</h3>
            <p style="color: #1e40af; margin-bottom: 0;">
              <strong>Shipping Address:</strong><br>
              ${shippingAddress}
            </p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            Your items will be shipped to the address above. You'll receive another email with tracking information once your order is processed.
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            Thank you for using our crossborderdata service!
          </p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              Best regards,<br>
              The Crossborderdata Team
            </p>
          </div>
        </div>
      </div>
    `;

    await sendEmail({
      to: crossborderdata.user_email,
      subject: emailSubject,
      html: emailHtml,
    });

    // Record payments in the payments table
    console.log('Recording payments for items:', selectedItems);
    
    const paymentRecords = selectedItems.map((itemId: string) => ({
      crossborderdata_id: crossborderdata.id,
      share_id: shareId,
      item_id: itemId,
      amount: total / selectedItems.length, // Split total equally among items
      payer_address: 'wallet_address', // You could get this from the payment
      transaction_hash: 'tx_hash' // You could get this from the payment response
    }));

    console.log('Payment records to insert:', paymentRecords);

    const { data: paymentData, error: paymentError } = await supabase
      .from('payments')
      .insert(paymentRecords)
      .select();

    if (paymentError) {
      console.error('Error recording payments:', paymentError);
      console.error('Payment error details:', paymentError.message);
      // Don't fail the email if database update fails
    } else {
      console.log('Payments recorded successfully:', paymentData);
      console.log('Items marked as paid:', selectedItems);
    }

    return NextResponse.json(
      {
        message: "Payment notification email sent successfully",
        recipient: crossborderdata.user_email,
        paidItems: selectedItems,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending payment notification email:", error);
    return NextResponse.json(
      { error: "Failed to send payment notification email" },
      { status: 500 }
    );
  }
} 