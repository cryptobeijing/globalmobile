import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { items, total, userInfo } = await request.json()
    
    // Generate a unique share ID
    const shareId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    
    // Insert the crossborderdata into the database
    const { data, error } = await supabase
      .from('crossborderdata')
      .insert([
        {
          items: items,
          total: total,
          share_id: shareId,
          user_name: userInfo?.name ? `${userInfo.name.familyName} ${userInfo.name.firstName}`.trim() : null,
          user_email: userInfo?.email || null,
          user_address: userInfo?.physicalAddress ? JSON.stringify(userInfo.physicalAddress) : null
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to save crossborderdata' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      shareId: shareId,
      crossborderdataId: data.id 
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 