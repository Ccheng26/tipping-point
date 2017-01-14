class RacesController < ApplicationController

  def index
  end

  def getdata
    state = params[:state]
    # grab all response %s, and margin of error. Take biggest two %s, subtract them, if result is lower than margin of error, it's close!
    response = HTTParty.get('https://elections.huffingtonpost.com/pollster/api/polls?state='+state+'&topic=2012-house')
    render :json => response
  end


end
